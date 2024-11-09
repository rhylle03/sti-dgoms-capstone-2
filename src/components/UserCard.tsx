import Image from "next/image";

const UserCard = ({ type }: { type: string }) => {
  return (
    <div className="rounded-2xl odd:bg-sti-blue even:bg-sti-yellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-gray-500">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold text-white my-4">0</h1>
      <h2 className="capitalize text-sm font-medium text-white">{type}</h2>
    </div>
  );
};

export default UserCard;
