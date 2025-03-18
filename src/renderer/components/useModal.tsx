import React, { useState } from "react";

function useModal(): [boolean, () => void] {
  const [showModal, setShowModal] = useState(false);
  const toggle = () => setShowModal(!showModal);

  return [showModal, toggle];
}

export default useModal;
