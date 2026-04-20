export const formatDateTime = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "N/A"

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return "Invalid Date"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

export const formatNotificationDate = (dateString: string | undefined): string => {
  return formatDateTime(dateString)
}