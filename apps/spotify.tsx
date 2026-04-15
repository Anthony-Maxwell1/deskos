function Player() {
  return <div>Spotify Player</div>;
}

export const manifest = {
  id: "spotify",
  name: "Spotify",
  widgets: [
    {
      id: "player",
      component: Player,
      sizes: ["1x1", "2x1", "3x1", "2x3", "1x3"] // If this isn't here, it's automatically
    }
  ]
};
