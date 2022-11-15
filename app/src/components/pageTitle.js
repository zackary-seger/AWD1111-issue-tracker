import React, { useEffect } from 'react';

function PageTitle(title) {
  useEffect(() => {
    document.title = title;
  });
}

export default PageTitle