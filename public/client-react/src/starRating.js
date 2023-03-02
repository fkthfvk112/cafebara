import React, { useState } from 'react'
import { Rating } from 'react-simple-star-rating'

export function StarRating(probs) {

  return (
    <div className='App'>
      <Rating
        initialValue={probs.value}
        size={probs.size}
        readonly
        iconsCount={probs.count}
        /* Available Props */
      />
    </div>
  )
}