import { describe, expect, it } from "vitest";
import { bookingSchema, buildBookingUrl } from "@/lib/viacars";

const booking = { name: "Mario Rossi", phone: "+39 333 1234567", date: "2026-12-01", time: "10:30", departure: "Fiumicino T3", destination: "Via Pisino 195, Roma", passengers: 2, service: "transfer" };
describe("Viacars booking", () => {
  it("addresses requests to the supplied WhatsApp number with all itinerary details", () => {
    const url = new URL(buildBookingUrl(booking, "it"));
    expect(url.origin + url.pathname).toBe("https://wa.me/393452233522");
    const text = url.searchParams.get("text");
    for (const value of ["Mario Rossi", "+39 333 1234567", "2026-12-01", "10:30", "Fiumicino T3", "Via Pisino 195, Roma", "Passeggeri: 2", "Transfer aeroporti e stazioni"]) expect(text).toContain(value);
  });
  it("allows 8 passengers but not 9 in the 7/8-seat minivan", () => {
    expect(bookingSchema.safeParse({ ...booking, service: "minivan", passengers: 8 }).success).toBe(true);
    expect(bookingSchema.safeParse({ ...booking, service: "minivan", passengers: 9 }).success).toBe(false);
  });
  it("allows 20 passengers but not 21 in the 20-seat minibus", () => {
    expect(bookingSchema.safeParse({ ...booking, service: "minibus", passengers: 20 }).success).toBe(true);
    expect(bookingSchema.safeParse({ ...booking, service: "minibus", passengers: 21 }).success).toBe(false);
  });
  it("rejects invalid input before opening WhatsApp", () => {
    expect(() => buildBookingUrl({ ...booking, phone: "<script>" }, "it")).toThrow();
    expect(bookingSchema.safeParse({ ...booking, date: "2026-02-30" }).success).toBe(false);
  });
});