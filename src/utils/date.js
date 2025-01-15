export const formatDate = (date, { day = 'numeric', month = 'short', year = 'numeric' } = {}) => {
  return new Date(date).toLocaleDateString('fr-CH', {
    day,
    month,
    year,
  });
};

export const formatDateLong = (date) => {
  const dateObj = new Date(date);

  return dateObj.toDateString() === new Date().toDateString()
    ? `Aujourd'hui à ${dateObj.toLocaleTimeString()}`
    : `Il y a ${Math.floor(
      (new Date() - dateObj) / (1000 * 60 * 60 * 24),
    )} jours à ${dateObj.toLocaleTimeString()}`;
}
