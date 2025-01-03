import { z } from "zod";
import type { Post } from "./post";

// Common schemas
export const EventPriceSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  type: z.enum(["per-person", "per-couple", "group"]).optional(),
});

export const EventScheduleItemSchema = z.object({
  time: z.string(),
  activity: z.string(),
  description: z.string().optional(),
});

export const EventLocationSchema = z.object({
  name: z.string(),
  city: z.string(),
  country: z.string(),
  address: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export const EventOrganizerSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
});

// Base event schema
export const BaseEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["party", "workshop", "concert", "festival"]),
  date: z.object({
    start: z.string(),
    end: z.string(),
  }),
  location: EventLocationSchema,
  description: z.string(),
  image: z.string().optional(),
  price: EventPriceSchema.optional(),
  tags: z.array(z.string()),
  status: z.enum(["upcoming", "ongoing", "past"]),
  artists: z.array(z.string()),
  organizer: EventOrganizerSchema,
  schedule: z.array(EventScheduleItemSchema),
  stats: z
    .object({
      interested: z.number().default(0),
      saves: z.number().default(0),
    })
    .optional(),
});

// Specific event types
export const PartyEventSchema = BaseEventSchema.extend({
  type: z.literal("party"),
});

export const WorkshopEventSchema = BaseEventSchema.extend({
  type: z.literal("workshop"),
  level: z.enum(["beginner", "intermediate", "advanced", "all"]),
  prices: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      currency: z.string(),
      description: z.string(),
    })
  ),
});

export const ConcertEventSchema = BaseEventSchema.extend({
  type: z.literal("concert"),
  venue: z
    .object({
      capacity: z.number(),
      seating: z.boolean(),
    })
    .optional(),
});

// Export types
export type EventPrice = z.infer<typeof EventPriceSchema>;
export type EventLocation = z.infer<typeof EventLocationSchema>;
export type EventOrganizer = z.infer<typeof EventOrganizerSchema>;
export type BaseEvent = z.infer<typeof BaseEventSchema>;
export type PartyEvent = z.infer<typeof PartyEventSchema>;
export type WorkshopEvent = z.infer<typeof WorkshopEventSchema>;
export type ConcertEvent = z.infer<typeof ConcertEventSchema>;

export type AnyEvent = PartyEvent | WorkshopEvent | ConcertEvent;

// Conversion to feed post
export const eventToFeedPost = (event: AnyEvent): Post => ({
  type: "event",
  author: {
    id: event.organizer.id,
    name: event.organizer.name,
    image: event.organizer.image,
    location: event.location.city,
  },
  content: {
    title: event.name,
    description: event.description,
    image: event.image,
    date: event.date.start,
    location: `${event.location.name}, ${event.location.city}`,
    price: event.price && {
      amount: event.price.amount,
      currency: event.price.currency,
    },
    tags: event.tags,
  },
  timestamp: new Date().toISOString(),
  stats: {
    interested: 0,
    comments: 0,
    bookmarks: 0,
  },
});
