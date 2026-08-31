import { Button } from "react-bootstrap";

export default function DeleteBlacklistButton({ onClick }) {

  return (
    <Button onClick={onClick} variant="danger" className="w-100 ms-2">
      <img
        src={`${process.env.PUBLIC_URL}/images/recycleIcon.svg`}
        alt="Recycle Icon"
        style={{ width: "24px", height: "24px", filter: "invert(1)" }}
      />
    </Button>
  )
}