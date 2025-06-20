type FeatureContainerProps = {
  img: string;
  header: string;
  desc: string;
};

export const FeatureContainerReverse = ({ img, header, desc }: FeatureContainerProps) => {
  return (
    <div className="flex items-center justify-between gap-10">
      <div className="text-left">
        <h1 className="text-5xl font-bold mb-3">{header}</h1>
        <p className="text-xl">{desc}</p>
      </div>
      <img src={img} alt="" width={500} />
    </div>
  );
};

const FeatureContainer = ({ img, header, desc }: FeatureContainerProps) => {
  return (
    <div className="flex items-center justify-between gap-10">
      <img src={img} alt="" width={500} />
      <div className="text-left">
        <h1 className="text-5xl font-bold mb-3">{header}</h1>
        <p className="text-xl">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureContainer;
