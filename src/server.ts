import app from './app';

const PORT: Number = 3000;

app.listen(PORT, (): void => console.log(`Serving at http://localhost:${PORT}`));
