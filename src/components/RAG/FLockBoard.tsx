import truncateEthAddress from "truncate-eth-address";
import Leaderboard from "@/src/components/RAG/Leaderboard";

interface FLockBoardProps{
  modelId?:string
}
export const FLockBoard = ({modelId}:FLockBoardProps) => {
    console.log(modelId)

    return (
        <div className="w-full bg-white p-8 rounded-3xl max-h-[637px]">
            <h2 className="text-lg font-extrabold">Leaderboard</h2>
            <Leaderboard modelId={modelId}/>
        </div>
    )
};