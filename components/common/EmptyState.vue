<script setup lang="ts">
interface EmptyStateContent {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    to: string
  }
}

type Variant =
  | 'artist-not-found'
  | 'no-results'
  | 'no-reviews'
  | 'no-media'
  | 'no-classes'
  | 'group-not-found'

const variants: Record<Variant, EmptyStateContent> = {
  'artist-not-found': {
    icon: 'ph:user-circle-x',
    title: 'Artist Not Found',
    description:
      "The artist you're looking for doesn't exist or has been removed.",
    action: {
      label: 'Browse Artists',
      to: '/artists',
    },
  },
  'no-results': {
    icon: 'ph:magnifying-glass',
    title: 'No Results Found',
    description: 'Try adjusting your search terms or filters.',
  },
  'no-reviews': {
    icon: 'ph:chat-circle',
    title: 'No Reviews Yet',
    description: 'Be the first to leave a review!',
    action: {
      label: 'Write a Review',
      to: '/review/new',
    },
  },
  'no-media': {
    icon: 'ph:image',
    title: 'No Media Yet',
    description: 'No photos or videos have been added yet.',
  },
  'no-classes': {
    icon: 'ph:graduation-cap',
    title: 'No Classes Available',
    description: 'No classes are currently scheduled.',
  },
  'group-not-found': {
    icon: 'ph:users-three',
    title: 'Group Not Found',
    description:
      'The group you are looking for does not exist or has been removed.',
    action: {
      label: 'Browse Groups',
      to: '/groups',
    },
  },
}

const props = defineProps<{
  variant: Variant
}>()

const content = computed(() => variants[props.variant])
</script>

<template>
  <div class="min-h-[50vh] flex items-center justify-center">
    <div class="text-center">
      <Icon
        :name="content.icon"
        class="w-16 h-16 text-muted-foreground mx-auto mb-4"
      />
      <h2 class="text-2xl font-bold text-foreground mb-2">
        {{ content.title }}
      </h2>
      <p class="text-muted-foreground mb-6">{{ content.description }}</p>
      <Button v-if="content.action" as-child>
        <NuxtLink :to="content.action.to">{{ content.action.label }}</NuxtLink>
      </Button>
    </div>
  </div>
</template>
