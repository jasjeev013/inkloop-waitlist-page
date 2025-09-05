import WaitlistLanding from "./components/waitlist-landing";
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <WaitlistLanding />
      {/* Add the Vercel Analytics component */}
      <Analytics />
    </div>
  );
}

export default App;
