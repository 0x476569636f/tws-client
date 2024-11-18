export const getAvatarUrl = (name: string) => {
  const params = new URLSearchParams({
    name: name,
    background: 'random',
    size: '200',
  });

  return `https://ui-avatars.com/api/?${params.toString()}`;
};
