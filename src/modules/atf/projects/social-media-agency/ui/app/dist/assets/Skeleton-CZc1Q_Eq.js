import{ap as v,Q as C,aq as b,g as k,a as w,r as x,u as S,j as R,c as $,d as M,s as U,m as A,ar as d,as as c,M as T}from"./index-nKbKQDZp.js";const q=v();function D({props:t,name:a,defaultTheme:e,themeId:s}){let n=C(e);return s&&(n=n[s]||n),b({theme:n,name:a,props:t})}function X(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function j(t){return parseFloat(t)}function P(t){return k("MuiSkeleton",t)}w("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const B=t=>{const{classes:a,variant:e,animation:s,hasChildren:n,width:i,height:o}=t;return M({root:["root",e,s,n&&"withChildren",n&&!i&&"fitContent",n&&!o&&"heightAuto"]},P,a)},r=d`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,l=d`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`,E=typeof r!="string"?c`
        animation: ${r} 2s ease-in-out 0.5s infinite;
      `:null,K=typeof l!="string"?c`
        &::after {
          animation: ${l} 2s linear 0.5s infinite;
        }
      `:null,N=U("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,a)=>{const{ownerState:e}=t;return[a.root,a[e.variant],e.animation!==!1&&a[e.animation],e.hasChildren&&a.withChildren,e.hasChildren&&!e.width&&a.fitContent,e.hasChildren&&!e.height&&a.heightAuto]}})(A(({theme:t})=>{const a=X(t.shape.borderRadius)||"px",e=j(t.shape.borderRadius);return{display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:T(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${e}${a}/${Math.round(e/.6*10)/10}${a}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(t.vars||t).shape.borderRadius}},{props:({ownerState:s})=>s.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:s})=>s.hasChildren&&!s.width,style:{maxWidth:"fit-content"}},{props:({ownerState:s})=>s.hasChildren&&!s.height,style:{height:"auto"}},{props:{animation:"pulse"},style:E||{animation:`${r} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(t.vars||t).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:K||{"&::after":{animation:`${l} 2s linear 0.5s infinite`}}}]}})),F=x.forwardRef(function(a,e){const s=S({props:a,name:"MuiSkeleton"}),{animation:n="pulse",className:i,component:o="span",height:p,style:m,variant:f="text",width:g,...h}=s,u={...s,animation:n,component:o,variant:f,hasChildren:!!h.children},y=B(u);return R.jsx(N,{as:o,ref:e,className:$(y.root,i),ownerState:u,...h,style:{width:g,height:p,...m}})});export{F as S,q as s,D as u};
