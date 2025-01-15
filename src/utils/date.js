export const formatDate = (date, { day, month, year } = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}) => {
  return new Date(date).toLocaleDateString('fr-CH', {
    day,
    month,
    year,
  });
};
