import React from "react";

const BaseLayout: React.FC<{ content: React.ReactNode }> = ({content}) => {
  return (
    <div className="grid grid-cols-3">
      <div/>
      {content}
      <div/>
    </div>
  )
}

export default BaseLayout