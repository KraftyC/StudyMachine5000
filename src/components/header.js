import { Container, Navbar } from "react-bootstrap";


export default function Header() {
  return (
    <Navbar className="bg-info">
      <Container>
        <Navbar.Brand className="text-white" style={{ fontFamily: "Metal Mania" }}>
          Mike's Study Machine 5000!
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}