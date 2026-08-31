import { useContext } from "react";
import { Container, Navbar } from "react-bootstrap";
import QContext from "../store/question-context";

export default function Header({ isSelected, isEditBlacklist, setIsEditBlacklist }) {
  const qCtx = useContext(QContext);
  const blacklistButtonClass = ["m-0", "fs-6", isEditBlacklist ? "text-danger fw-bold" : "text-black fst-italic"].join(" ");

  function ToggleBlacklist() {
    if (!isEditBlacklist) {
      qCtx.setSelection({ courseCode: null, chapters: [], mode: null, origins: [], quantity: null });
      setIsEditBlacklist(true);
    } else window.location.reload();
  }

  return (
    <Navbar className="bg-info">
      <Container className="space-between">
        <Navbar.Brand className="text-white" style={{ fontFamily: "Metal Mania", cursor: "pointer" }} onClick={() => window.location.reload()}>
          Mike's Study Machine 5000!
        </Navbar.Brand>
        {(qCtx.blacklist.length > 0 && !isSelected) && <Navbar.Brand className={blacklistButtonClass} style={{ cursor: "pointer" }} onClick={ToggleBlacklist}>
          Edit Blacklist
        </Navbar.Brand>}
      </Container>
    </Navbar>
  );
}