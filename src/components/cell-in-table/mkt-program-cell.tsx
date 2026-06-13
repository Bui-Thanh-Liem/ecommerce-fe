import { IMarketingProgram } from "@/shared/interfaces/models/mkt-program/marketing-program.interface"
import Image from "next/image"

export function MktProgramCell({
  mktProgram,
}: {
  mktProgram: IMarketingProgram
}) {
  return (
    <>
      <Image
        width={40}
        height={40}
        alt={mktProgram.name}
        src={mktProgram.mainImage.url}
      />
      <p className="max-w-60 overflow-auto whitespace-normal">
        {mktProgram.name || "-"}
      </p>
    </>
  )
}
