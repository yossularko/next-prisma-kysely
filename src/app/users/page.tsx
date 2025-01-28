import React from 'react'

const Page = () => {
  return (
    <div>
        {Array(120).fill("a").map((_, idx) => {
            return(
                <p key={idx}>User {idx + 1}</p>
            )
        })}
    </div>
  )
}

export default Page