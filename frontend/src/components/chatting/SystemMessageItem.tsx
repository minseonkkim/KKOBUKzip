function SystemMessageItem({
  title,
  price,
  image,
}: {
  title: string;
  price: number;
  image: string;
}) {
  return (
    <div className="flex items-center my-2">
      <img
        src={image}
        alt={title}
        className="w-[100px] h-auto rounded-lg mr-4"
      />
      <div className="flex flex-col">
        <p className="text-[16px] lg:text-[14px] font-bold">{title}</p>
        <p className="text-[14px] text-gray-700">
          {price.toLocaleString()} TURT
        </p>
      </div>
    </div>
  );
}

export default SystemMessageItem;
