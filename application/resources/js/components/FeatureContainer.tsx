type FeatureContainerProps = {
    img: string;
    header: string;
    desc: string;
};

export const FeatureContainerReverse = ({ img, header, desc }: FeatureContainerProps) => {
    return (
        <div className="flex items-center justify-between gap-10 max-lg:flex-col">
            <h1 className="mb-3 text-5xl font-bold max-lg:text-4xl lg:hidden">{header}</h1>
            <img src={img} alt="" width={450} className="lg:hidden" />
            <div className="text-left">
                <h1 className="mb-3 text-5xl font-bold max-lg:hidden max-lg:text-4xl">{header}</h1>
                <p className="text-xl">{desc}</p>
            </div>
            <img src={img} alt="" width={450} className="max-lg:hidden" />
        </div>
    );
};

const FeatureContainer = ({ img, header, desc }: FeatureContainerProps) => {
    return (
        <div className="flex items-center justify-between gap-10 max-lg:flex-col">
            <h1 className="mb-3 text-5xl font-bold max-lg:text-4xl lg:hidden">{header}</h1>
            <img src={img} alt="" width={450} />
            <div className="text-left">
                <h1 className="mb-3 text-5xl font-bold max-lg:hidden max-lg:text-4xl">{header}</h1>
                <p className="text-xl">{desc}</p>
            </div>
        </div>
    );
};

export default FeatureContainer;
