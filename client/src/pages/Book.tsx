import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useCheckAvailability, useCreateBooking, useListRooms, getCheckAvailabilityQueryKey, customFetch, getBookingByCode } from "@/lib/api-client-react";
import type { Booking, BookingInput } from "@/lib/api-client-react";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Users, Maximize, Bed, ArrowRight, Calendar, Plus, Trash2 } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { getErrorMessage } from "@/lib/api-error";

const CURRENCY_SYMBOL: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

interface SearchForm {
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
}

interface GuestForm {
  fullName: string;
  email: string;
  phones: { value: string }[];
  specialRequests?: string;
}

type Step = "search" | "select" | "guest" | "confirm";

function defaultSearch(): SearchForm {
  return {
    checkIn: "",
    checkOut: "",
    adults: "",
    children: "",
  };
}

function toGuestCount(value: string): number {
  return Number(value) || 0;
}

export default function Book() {
  const params = new URLSearchParams(window.location.search);
  const initialRoomId = params.get("roomId");

  const [step, setStep] = useState<Step>(initialRoomId ? "select" : "search");
  const [search, setSearch] = useState<SearchForm>({
    checkIn: params.get("checkIn") ?? "",
    checkOut: params.get("checkOut") ?? "",
    adults: params.get("adults") ?? params.get("guests") ?? "",
    children: params.get("children") ?? "",
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(initialRoomId);
  const [confirmation, setConfirmation] = useState<{ confirmationCode: string; totalPrice: number; currency: string; heading?: string } | null>(null);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [manageCode, setManageCode] = useState("");
  const [manageError, setManageError] = useState("");

  const adultCount = toGuestCount(search.adults);
  const childCount = toGuestCount(search.children);
  const totalGuests = adultCount + childCount;
  const availParams = { checkIn: search.checkIn, checkOut: search.checkOut, guests: totalGuests };
  const { data: availability, isLoading: searching, refetch } = useCheckAvailability(
    availParams,
    { query: { enabled: step !== "search", queryKey: getCheckAvailabilityQueryKey(availParams) } },
  );

  const { data: allRooms } = useListRooms();
  const createBooking = useCreateBooking();
  const lookupBooking = useMutation({
    mutationFn: (code: string) => getBookingByCode(code.trim().toUpperCase()),
  });
  const updateBooking = useMutation({
    mutationFn: ({ code, data }: { code: string; data: BookingInput }) =>
      customFetch<Booking>(`/api/bookings/${code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
  });
  const cancelBooking = useMutation({
    mutationFn: (code: string) =>
      customFetch<Booking>(`/api/bookings/${code}/cancel`, {
        method: "PATCH",
      }),
  });
  const guestForm = useForm<GuestForm>({
    defaultValues: { phones: [{ value: "" }] },
  });
  const phoneFields = useFieldArray({ control: guestForm.control, name: "phones" });

  const nights = Math.max(1, differenceInCalendarDays(new Date(search.checkOut), new Date(search.checkIn)));

  const availableRooms = (availability ?? []).filter((a) => a.available).map((a) => a.room);
  const selectedRoom =
    availableRooms.find((r) => r.id === selectedRoomId) ??
    allRooms?.find((r) => r.id === selectedRoomId);

  const symbol = selectedRoom ? (CURRENCY_SYMBOL[selectedRoom.currency] ?? selectedRoom.currency) : "€";
  const total = selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("select");
    setTimeout(() => refetch(), 0);
  };

  const resetReservation = () => {
    setSearch(defaultSearch());
    setSelectedRoomId(null);
    setConfirmation(null);
    setEditingCode(null);
    setManageCode("");
    setManageError("");
    guestForm.reset({ fullName: "", email: "", phones: [{ value: "" }], specialRequests: "" });
    window.history.replaceState(null, "", "/book");
    setStep("search");
  };

  const bookingInputFromGuest = (data: GuestForm): BookingInput | null => {
    if (!selectedRoom) return null;

    return {
      roomId: selectedRoom.id,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guests: totalGuests,
      adults: adultCount,
      children: childCount,
      guestName: data.fullName,
      guestEmail: data.email,
      guestPhone: data.phones[0]?.value.trim() || "",
      guestPhones: data.phones.map((phone) => phone.value.trim()).filter(Boolean),
      specialRequests: data.specialRequests || undefined,
    };
  };

  const onSubmitGuest = (data: GuestForm) => {
    const bookingInput = bookingInputFromGuest(data);
    if (!bookingInput) return;

    if (editingCode) {
      updateBooking.mutate(
        { code: editingCode, data: bookingInput },
        {
          onSuccess: (booking) => {
            setConfirmation({
              confirmationCode: booking.confirmationCode,
              totalPrice: booking.totalPrice,
              currency: booking.currency,
              heading: "Reservation updated",
            });
            setEditingCode(null);
            guestForm.reset({ fullName: "", email: "", phones: [{ value: "" }], specialRequests: "" });
            setStep("confirm");
          },
        },
      );
      return;
    }

    createBooking.mutate(
      { data: bookingInput },
      {
        onSuccess: (booking) => {
          setConfirmation({
            confirmationCode: booking.confirmationCode,
            totalPrice: booking.totalPrice,
            currency: booking.currency,
          });
          guestForm.reset({ fullName: "", email: "", phones: [{ value: "" }], specialRequests: "" });
          setStep("confirm");
        },
      },
    );
  };

  const loadBookingForEdit = (booking: Booking) => {
    if (booking.status === "cancelled") {
      setManageError("This reservation has already been cancelled.");
      return;
    }

    setSearch({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      adults: String(booking.adults ?? booking.guests),
      children: String(booking.children ?? 0),
    });
    setSelectedRoomId(booking.roomId);
    setEditingCode(booking.confirmationCode);
    guestForm.reset({
      fullName: booking.guestName,
      email: booking.guestEmail,
      phones: (booking.guestPhones?.length ? booking.guestPhones : [booking.guestPhone]).map((phone) => ({ value: phone })),
      specialRequests: booking.specialRequests ?? "",
    });
    setManageError("");
    setStep("guest");
  };

  const onLookupReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setManageError("");
    lookupBooking.mutate(manageCode, {
      onSuccess: loadBookingForEdit,
      onError: (error) => setManageError(getErrorMessage(error)),
    });
  };

  const onCancelReservation = (code: string) => {
    if (!window.confirm("Cancel this reservation? This will release the room for those dates.")) return;
    cancelBooking.mutate(code, {
      onSuccess: () => {
        setManageError("");
        setConfirmation(null);
        setEditingCode(null);
        guestForm.reset({ fullName: "", email: "", phones: [{ value: "" }], specialRequests: "" });
        setStep("search");
      },
      onError: (error) => setManageError(getErrorMessage(error)),
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <div>
      <PageHero
        eyebrow="Reservations"
        title="Book your stay."
        description="Direct bookings always carry our best rate, with a welcome aperitif on arrival and breakfast on the terrace each morning."
        image="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2400&q=80"
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Stepper current={step} />

          {step === "search" && (
            <div className="mt-12 space-y-8">
            <form onSubmit={onSearch} className="bg-card border border-card-border rounded-md p-8 sm:p-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end shadow-sm">
              <SearchField label="Check in">
                <Input type="date" min={todayPlus(0)} value={search.checkIn} onChange={(e) => setSearch({ ...search, checkIn: e.target.value })} className="h-12" required />
              </SearchField>
              <SearchField label="Check out">
                <Input type="date" min={search.checkIn} value={search.checkOut} onChange={(e) => setSearch({ ...search, checkOut: e.target.value })} className="h-12" required />
              </SearchField>
              <SearchField label="Adults">
                <Input type="number" min={1} value={search.adults} onChange={(e) => setSearch({ ...search, adults: e.target.value })} className="h-12" required />
              </SearchField>
              <SearchField label="Children">
                <Input type="number" min={0} value={search.children} onChange={(e) => setSearch({ ...search, children: e.target.value })} className="h-12" required />
              </SearchField>
              <Button type="submit" size="lg" className="sm:col-span-2 lg:col-span-4 rounded-full h-12">Search availability</Button>
            </form>

            <form onSubmit={onLookupReservation} className="bg-card border border-card-border rounded-md p-6 sm:p-8 shadow-sm">
              <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-end">
                <SearchField label="Manage reservation">
                  <Input value={manageCode} onChange={(e) => setManageCode(e.target.value)} className="h-12 uppercase" placeholder="AG-XXXXXXXX" required />
                </SearchField>
                <Button type="submit" variant="outline" className="h-12 rounded-full px-8" disabled={lookupBooking.isPending}>
                  {lookupBooking.isPending ? "Finding..." : "Find reservation"}
                </Button>
              </div>
              {lookupBooking.data && !manageError && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-sm">
                  <div>
                    <p className="font-medium">{lookupBooking.data.roomName}</p>
                    <p className="text-muted-foreground">{lookupBooking.data.checkIn} to {lookupBooking.data.checkOut} · {lookupBooking.data.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" className="rounded-full" onClick={() => loadBookingForEdit(lookupBooking.data)}>
                      Edit
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => onCancelReservation(lookupBooking.data.confirmationCode)} disabled={cancelBooking.isPending || lookupBooking.data.status === "cancelled"}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {(manageError || cancelBooking.isError) && (
                <p className="text-sm text-destructive mt-3">{manageError || getErrorMessage(cancelBooking.error)}</p>
              )}
            </form>
            </div>
          )}

          {step === "select" && (
            <div className="mt-12">
              <SearchSummary search={search} nights={nights} onEdit={() => setStep("search")} />

              {searching && (
                <div className="mt-8 grid gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-48 bg-muted rounded-md animate-pulse" />
                  ))}
                </div>
              )}

              {!searching && availableRooms.length === 0 && (
                <div className="mt-12 text-center bg-card border border-card-border rounded-md p-12">
                  <h3 className="font-display text-3xl mb-3">No rooms available for those dates.</h3>
                  <p className="text-muted-foreground mb-6">Please try different dates, or call us directly — we can often help.</p>
                  <Button variant="outline" onClick={() => setStep("search")}>Try other dates</Button>
                </div>
              )}

              {!searching && availableRooms.length > 0 && (
                <div className="mt-8 grid gap-6">
                  {availableRooms.map((room) => {
                    const sym = CURRENCY_SYMBOL[room.currency] ?? room.currency;
                    return (
                      <article key={room.id} className="bg-card border border-card-border rounded-md overflow-hidden grid md:grid-cols-[280px_1fr] shadow-sm hover:shadow-md transition">
                        <div className="aspect-[4/3] md:aspect-auto bg-muted overflow-hidden">
                          <img src={room.images[0] ?? "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80"} alt={room.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 flex flex-col">
                          <p className="font-eyebrow text-accent">{room.category}</p>
                          <h3 className="font-display text-2xl mt-1">{room.name}</h3>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{room.description}</p>
                          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground mt-4">
                            <span className="flex items-center gap-1.5"><Maximize size={13} />{room.sizeSqm} m²</span>
                            <span className="flex items-center gap-1.5"><Users size={13} />{room.capacity}</span>
                            <span className="flex items-center gap-1.5"><Bed size={13} />{room.bedType}</span>
                          </div>
                          <div className="mt-auto pt-5 border-t border-border flex items-end justify-between flex-wrap gap-3">
                            <div>
                              <p className="font-display text-2xl text-primary">{sym}{(room.pricePerNight * nights).toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{nights} night{nights > 1 ? "s" : ""} · {sym}{room.pricePerNight.toLocaleString()}/night</p>
                            </div>
                            <Button onClick={() => { setSelectedRoomId(room.id); setStep("guest"); }} className="rounded-full px-6">
                              Select <ArrowRight size={16} className="ml-1" />
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === "guest" && selectedRoom && (
            <div className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-8">
              <form onSubmit={guestForm.handleSubmit(onSubmitGuest)} className="bg-card border border-card-border rounded-md p-8 sm:p-10 space-y-5 shadow-sm">
                <h3 className="font-display text-3xl mb-2">{editingCode ? "Modify reservation" : "Guest details"}</h3>
                <p className="text-muted-foreground text-sm mb-4">No payment is collected here — confirmation, then a secure pay link by email.</p>
                <Field label="Full name" error={guestForm.formState.errors.fullName?.message}>
                  <Input {...guestForm.register("fullName", { required: "Required" })} className="h-11" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Email" error={guestForm.formState.errors.email?.message}>
                    <Input type="email" {...guestForm.register("email", { required: "Required" })} className="h-11" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Label className="font-eyebrow text-muted-foreground">Phone numbers</Label>
                    <div className="mt-2 space-y-3">
                      {phoneFields.fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <Input
                            type="tel"
                            {...guestForm.register(`phones.${index}.value`, { required: index === 0 ? "Required" : false })}
                            className="h-11"
                            placeholder={index === 0 ? "Primary phone" : "Additional phone"}
                          />
                          {phoneFields.fields.length > 1 && (
                            <Button type="button" variant="outline" size="icon" className="h-11 w-11 shrink-0" onClick={() => phoneFields.remove(index)} aria-label="Remove phone number">
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {guestForm.formState.errors.phones?.[0]?.value?.message && (
                      <p className="text-xs text-destructive mt-1">{guestForm.formState.errors.phones[0].value.message}</p>
                    )}
                    <Button type="button" variant="outline" size="sm" className="mt-3 rounded-full" onClick={() => phoneFields.append({ value: "" })}>
                      <Plus size={15} className="mr-1" /> Add phone
                    </Button>
                  </div>
                </div>
                <Field label="Special requests (optional)">
                  <Textarea rows={4} {...guestForm.register("specialRequests")} className="resize-none" placeholder="Anniversary, dietary preferences, late arrival, etc." />
                </Field>
                {(createBooking.isError || updateBooking.isError) && (
                  <p className="text-sm text-destructive">{getErrorMessage(updateBooking.error ?? createBooking.error)}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="rounded-full" onClick={() => setStep(editingCode ? "search" : "select")}>Back</Button>
                  <Button type="submit" size="lg" className="flex-1 rounded-full" disabled={createBooking.isPending || updateBooking.isPending}>
                    {createBooking.isPending || updateBooking.isPending ? "Saving..." : editingCode ? "Save changes" : "Confirm reservation"}
                  </Button>
                </div>
              </form>

              <aside className="bg-card border border-card-border rounded-md overflow-hidden shadow-sm self-start sticky top-28">
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  <img src={selectedRoom.images[0] ?? "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80"} alt={selectedRoom.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="font-eyebrow text-accent">{selectedRoom.category}</p>
                  <h4 className="font-display text-2xl mt-1">{selectedRoom.name}</h4>
                  <dl className="mt-5 space-y-3 text-sm border-t border-border pt-5">
                    <Row label="Check in"><span>{format(new Date(search.checkIn), "EEE, d MMM yyyy")}</span></Row>
                    <Row label="Check out"><span>{format(new Date(search.checkOut), "EEE, d MMM yyyy")}</span></Row>
                    <Row label="Guests"><span>{totalGuests}</span></Row>
                    <Row label="Adults"><span>{adultCount}</span></Row>
                    <Row label="Children"><span>{childCount}</span></Row>
                    <Row label="Nights"><span>{nights}</span></Row>
                  </dl>
                  <div className="border-t border-border mt-5 pt-5 flex justify-between items-end">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-display text-3xl text-primary">{symbol}{total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Taxes & service included · Free cancellation up to 7 days before arrival</p>
                </div>
              </aside>
            </div>
          )}

          {step === "confirm" && confirmation && (
            <div className="mt-12 max-w-2xl mx-auto bg-card border border-card-border rounded-md p-10 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/15 grid place-items-center">
                <Check size={32} className="text-accent" />
              </div>
              <p className="font-eyebrow text-accent mb-3">{confirmation.heading ?? "Reservation confirmed"}</p>
              <h2 className="font-display text-4xl sm:text-5xl mb-4">We can't wait to welcome you.</h2>
              <p className="text-muted-foreground">A confirmation has been sent. Please keep this code for your records.</p>
              <div className="mt-8 inline-block bg-muted/50 border border-border rounded-md px-8 py-5">
                <p className="font-eyebrow text-muted-foreground mb-2">Confirmation code</p>
                <p className="font-display text-3xl tracking-wider text-primary">{confirmation.confirmationCode}</p>
              </div>
              <p className="mt-6 text-lg">Total · <span className="font-display text-2xl text-primary">{(CURRENCY_SYMBOL[confirmation.currency] ?? confirmation.currency)}{confirmation.totalPrice.toLocaleString()}</span></p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button variant="outline" className="rounded-full px-8" onClick={() => { setManageCode(confirmation.confirmationCode); lookupBooking.mutate(confirmation.confirmationCode, { onSuccess: loadBookingForEdit, onError: (error) => setManageError(getErrorMessage(error)) }); }}>
                  Edit reservation
                </Button>
                <Button variant="outline" className="rounded-full px-8" onClick={() => onCancelReservation(confirmation.confirmationCode)} disabled={cancelBooking.isPending}>
                  Cancel reservation
                </Button>
                <Button className="rounded-full px-8" onClick={resetReservation}>
                  Make another reservation
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SearchField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="font-eyebrow text-muted-foreground">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="font-eyebrow text-muted-foreground">{label}</Label>
      <div className="mt-2">{children}</div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between text-foreground">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function SearchSummary({ search, nights, onEdit }: { search: SearchForm; nights: number; onEdit: () => void }) {
  const adultCount = toGuestCount(search.adults);
  const childCount = toGuestCount(search.children);
  const totalGuests = adultCount + childCount;
  return (
    <div className="bg-card border border-card-border rounded-md p-5 sm:p-6 flex flex-wrap items-center gap-x-8 gap-y-3 justify-between">
      <div className="flex flex-wrap gap-x-8 gap-y-2 items-center text-sm">
        <span className="flex items-center gap-2"><Calendar size={14} className="text-accent" />{format(new Date(search.checkIn), "d MMM")} → {format(new Date(search.checkOut), "d MMM yyyy")}</span>
        <span className="text-muted-foreground">{nights} night{nights > 1 ? "s" : ""}</span>
        <span className="flex items-center gap-1.5 text-muted-foreground"><Users size={13} />{totalGuests} guest{totalGuests > 1 ? "s" : ""}</span>
        <span className="text-muted-foreground">{adultCount} adult{adultCount > 1 ? "s" : ""}</span>
        <span className="text-muted-foreground">{childCount} children</span>
      </div>
      <Button variant="outline" size="sm" className="rounded-full" onClick={onEdit}>Modify search</Button>
    </div>
  );
}

const STEPS: { key: Step; label: string }[] = [
  { key: "search", label: "Dates" },
  { key: "select", label: "Room" },
  { key: "guest", label: "Details" },
  { key: "confirm", label: "Confirmed" },
];

function Stepper({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((s, i) => {
        const active = i === idx;
        const done = i < idx;
        return (
          <div key={s.key} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full grid place-items-center text-xs font-medium border-2 ${active ? "bg-primary text-primary-foreground border-primary" : done ? "bg-accent text-accent-foreground border-accent" : "bg-card border-border text-muted-foreground"}`}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={`hidden sm:inline text-sm ${active ? "font-medium text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-6 sm:w-12 h-px ${done ? "bg-accent" : "bg-border"}`} />}
          </div>
        );
      })}
    </div>
  );
}

