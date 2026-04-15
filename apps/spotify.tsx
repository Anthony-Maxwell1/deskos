function Player() {
  return <div>Spotify Player</div>;
}

export const manifest = {
  id: "spotify",
  name: "Spotify",
  widgets: [
    {
      id: "player",
      name: "Player",
      defaultProps: {},
      component: Player
    }
  ]
};
