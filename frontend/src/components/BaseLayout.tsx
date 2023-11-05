import React from "react";

const BaseLayout: React.FC<{ content: React.ReactNode, sideBar: React.ReactNode }> = ({content, sideBar}) => {
  return (
    <div className="grid grid-cols-3">
      {sideBar}
      {content}
      <div/>
    </div>
  )
}

export default BaseLayout