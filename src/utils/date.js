export const formatDate = (date, { day = 'numeric', month = 'short', year = 'numeric' } = {}) => {
  return new Date(date).toLocaleDateString('fr-CH', {
    day,
    month,
    year,
  });
};

export const formatDateLong = (date) => {
  const dateObj = new Date(date);

  if(dateObj.toDateString() === new Date().toDateString()) {
    return `Aujourd'hui à ${dateObj.toLocaleTimeString()}`;
  } else {
    const days = Math.floor((new Date() - dateObj) / (1000 * 60 * 60 * 24));
    if (days <= 1) {
      return `Hier à ${dateObj.toLocaleTimeString()}`;
    } else {
      return `Il y a ${days} jours à ${dateObj.toLocaleTimeString()}`;
    }
  }
}
