import { Button, Link } from "@nextui-org/react";

export default function Navbar() {
  return (
    <div className="fixed w-full bottom-0 left-0 bg-green-600">
      <Button as={Link} href="/" color="primary">
        Home
      </Button>
      <Button as={Link} href="chat" color="">
        Chat
      </Button>
      <Button as={Link} href="profile" color="">
        Profile
      </Button>
    </div>
  );
}
