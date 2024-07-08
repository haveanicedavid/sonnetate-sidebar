import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/sign-in">Sign In</Link>
      <Link to="/sign-up">Sign up</Link>
    </div>
  )
}
