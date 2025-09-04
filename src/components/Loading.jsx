import Layout from "../layouts/LayoutPrimary";
import LoadingAnimation from "../assets/images/loading.gif";

export default function Loading({ className }) {
  return (
    <Layout className={`${className ? className : ""}`}>
      <div className="h-full w-full flex justify-center items-center">
        <img src={LoadingAnimation} alt="Loading" className="w-12 h-12" />
      </div>
    </Layout>
  );
}
