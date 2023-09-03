import * as React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      rel="preload"
      href="/fonts/frameHead/FrameHead-Bold-Trial.otf"
      as="font"
      type="font/otf"
      crossOrigin="anonymous"
      key="interFont"
/>,  ]);
};
