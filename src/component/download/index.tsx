import React from 'react';
import { Button } from 'antd';
import { stringify } from '../../codec/browser';
import { $problems } from '../../state';

function downloadBlob(blob: Blob, name = 'fps.xml') {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  // Remove link from body
  document.body.removeChild(link);
}

function handleDownload() {
  const data = $problems.get();
  const str = stringify(data);

  const blob = new Blob([str], { type: 'text/xml' });
  downloadBlob(blob);
}

export function Download() {
  return (
    <Button onClick={handleDownload} variant="outlined">
      导出当前数据
    </Button>
  );
}
