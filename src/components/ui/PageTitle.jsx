const PageTitle = ({ title, description }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
      {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
    </div>
  );
};

export default PageTitle;
