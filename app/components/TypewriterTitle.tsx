"use client"

import Typewriter from 'typewriter-effect';

export function TypewriterTitle() {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString('Schreiben Sie bessere Hausarbeiten.')
          .pauseFor(1000)
          .deleteAll()
          .typeString('Mit KI-Unterstützung.')
          .pauseFor(1000)
          .deleteAll()
          .typeString('Effizient und strukturiert.')
          .pauseFor(1000)
          .start();
      }}
    />
  );
} 