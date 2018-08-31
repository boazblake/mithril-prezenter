const m = require("mithril");

const ViewLayout = vnode => {
  return {
    view: () => [
      <StageBanner action={vnode.attrs.action} title={vnode.attrs.title} />,
      <CardContainer>{vnode.attrs.children}</CardContainer>
    ]
  };
};

export default ViewLayout;
