export const reverseGeocoding = async (latitude, longitude) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
  const data = await response.json();

  if (data.error) {
    return 'Quelque part sur Terre';
  }

  return data.display_name;
}
