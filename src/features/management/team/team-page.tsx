"use client"

import { DataTable } from "@/components/data-table"
import { useFilters } from "@/hooks/apis/use-filters"
import {
  useDeleteTeam,
  useFindAllTeams,
  useUpdateTeam,
} from "@/hooks/apis/use-team"
import { VALUE_HEADQUARTER } from "@/shared/constants/team.constant"
import { ITeam } from "@/shared/interfaces/models/team.interface"
import { useState } from "react"
import { StoreSelect } from "./filters/store-select"
import { TeamAction } from "./team-action"
import { teamColumns } from "./team-column"
import { TeamHierarchy } from "./team-hierarchy"
import { TeamAddMember } from "./team-add-member"

export function TeamPage() {
  const { filters } = useFilters()
  const safeFilters = filters as { store: string }
  const storeId = safeFilters.store || VALUE_HEADQUARTER

  const { mutateAsync } = useDeleteTeam()
  const { mutateAsync: mutateUpdateTeamAsync } = useUpdateTeam()
  const { data } = useFindAllTeams({
    filters: {
      store: storeId === VALUE_HEADQUARTER ? "" : storeId,
    },
  })
  const metaDataTeams = data?.metadata

  // State quản lý dialog
  const [openFromAddMember, setOpenFromAddMember] = useState(false)
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<ITeam | null>(null)
  const [dataEdit, setDataEdit] = useState<ITeam | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    setOpenFromAddMember(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  // Hàm xóa member khỏi team
  async function deleteMember(team: ITeam, staffId: string) {
    try {
      const newMemberIds =
        team.members?.filter((m) => m.id !== staffId).map((m) => m.id) || []

      await mutateUpdateTeamAsync({
        id: team.id,
        payload: { members: [...new Set(newMemberIds)] },
      })
    } catch (error) {
      console.log("Error deleting member :::", error)
    }
  }

  // Hàm promote member lên làm leader
  async function promoteToLeader(team: ITeam, staffId: string) {
    try {
      const newLeader = staffId
      const newMemberIds = team.members
        ?.filter((m) => m.id !== staffId)
        .map((m) => m.id)

      if (staffId !== team.leader?.id) {
        newMemberIds.push(team.leader?.id || "")
      }

      await mutateUpdateTeamAsync({
        id: team.id,
        payload: {
          leader: newLeader,
          members: [...new Set(newMemberIds)],
        },
      })
    } catch (error) {
      console.log("Error promoting member to leader :::", error)
    }
  }

  // Hàm xóa team
  async function handleDeleteRow(row: ITeam) {
    try {
      const res = await mutateAsync(row.id)
      if (res?.statusCode === 200) {
        setOpen(false)
      }
    } catch (error) {
      console.log("Error delete team :::", error)
    }
  }

  if (!metaDataTeams) return null

  return (
    <>
      <DataTable
        dataSource={metaDataTeams}
        columns={teamColumns}
        filters={<StoreSelect />}
        //
        onAddRow={() => setOpen(true)}
        onEditRow={(row) => {
          setOpen(true)
          setDataEdit(row.original)
        }}
        onDeleteRow={(row) => {
          handleDeleteRow(row.original)
        }}
        //
        tabHeader="Hierarchy"
        tabContent={
          <TeamHierarchy
            dataSource={metaDataTeams}
            storeId={storeId}
            onCreate={(initialTeam) => {
              setInitialData(initialTeam)
              setOpen(true)
            }}
            onEdit={(team) => {
              setDataEdit(team)
              setOpen(true)
            }}
            onDelete={handleDeleteRow}
            addMember={(team) => {
              setDataEdit(team)
              setOpenFromAddMember(true)
            }}
            deleteMember={deleteMember}
            promoteToLeader={promoteToLeader}
          />
        }
      />

      {open && (
        <TeamAction
          open={open}
          dataEdit={dataEdit}
          selectedParent={null}
          onClose={handleClose}
          initialData={initialData}
        />
      )}

      {openFromAddMember && (
        <TeamAddMember
          open={openFromAddMember}
          dataEdit={dataEdit}
          onClose={handleClose}
        />
      )}
    </>
  )
}
