// import React from 'react';
//
// // 在tsx官方定义的标签库上做扩展
// declare namespace JSX {
//   interface IntrinsicElements {
//     target: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
//     Component: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
//   }
// }

// 允许ts,tsx文件引入less文件
declare module '*.less' {
  const styles: any;
  export = styles;
}

// 允许ts,tsx文件引入less文件
declare module '*.scss' {
  const styles: any;
  export = styles;
}

// 允许ts,tsx文件引入图片
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.html';
declare module '*.ejs';

declare module 'react-loadable';
