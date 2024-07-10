'use client'

import {
  MoreVert,
  Refresh,
  SettingsApplications,
  ViewList,
  ViewModule,
} from '@mui/icons-material'
import {
  Box,
  Dropdown,
  Grid,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/joy'
import { lazy, ReactNode, useState } from 'react'
import { StandardModal } from './standardModal'
import {
  EntityCompose,
  EntityProvider,
  collectionState,
} from '@/app/cowpoke/providers/entityProvider'

export interface CollectionPaginatorProps<T> {
  card?: ReactNode
  provider?: EntityProvider<T>
  modal?: ReactNode
  tableColumns?: ReactNode
  tableHeaders?: ReactNode
  useCollection: () => collectionState<T>
}

export const CollectionPaginator = <T,>({
  card,
  modal,
  provider,
  tableColumns,
  tableHeaders,
  useCollection,
}: CollectionPaginatorProps<T>) => {
  const { index, indexRequest, total, updateIndex } = useCollection()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeId, setActiveId] = useState('')
  const LazyReactJson = lazy(() => import('react-json-view'))
  const defaultTab = tableHeaders && tableColumns ? 0 : 1

  const handleModalOpen = (_id: string) => {
    setActiveId(_id)
    setModalOpen(true)
  }

  return (
    <Box
      sx={{
        width: '100%',
      }}>
      <Tabs
        aria-label='Search Tabs'
        defaultValue={defaultTab}
        sx={{
          overflowX: 'hidden',
        }}>
        <TabList
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Tooltip placement='top' title='Refresh'>
              <IconButton onClick={() => indexRequest?.()} size='sm'>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Typography level='title-md' mr={4}>
              {total} found
            </Typography>
          </Stack>
          <Stack direction='row'>
            {tableHeaders && tableColumns ? (
              <Tooltip placement='top' title='Table'>
                <Tab value={0}>
                  <ViewList />
                </Tab>
              </Tooltip>
            ) : null}
            {card ? (
              <Tooltip placement='top' title='Grid'>
                <Tab value={1}>
                  <ViewModule />
                </Tab>
              </Tooltip>
            ) : null}
            <Tooltip placement='top' title='Dev'>
              <Tab value={2}>
                <SettingsApplications />
              </Tab>
            </Tooltip>
          </Stack>
        </TabList>
        {tableHeaders && tableColumns ? (
          <TabPanel
            value={0}
            sx={{
              padding: 0,
            }}>
            <Table
              borderAxis='none'
              stickyFooter
              stickyHeader
              sx={{
                '& th': {
                  height: 'auto',
                },
              }}>
              <thead>
                <tr>
                  {tableHeaders}
                  <th
                    style={{
                      width: 100,
                      textAlign: 'right',
                    }}>
                    Options
                  </th>
                </tr>
              </thead>
              <tbody>
                {index?.map(item => (
                  <EntityCompose
                    _id={item._id}
                    initialValues={item}
                    key={item?._id}
                    provider={provider}
                    updateIndex={updateIndex}>
                    <tr>
                      {tableColumns}
                      <td
                        style={{
                          textAlign: 'right',
                        }}>
                        <Dropdown>
                          <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{
                              root: { variant: 'outlined', color: 'neutral' },
                            }}>
                            <MoreVert />
                          </MenuButton>
                          <Menu>
                            {modal ? (
                              <MenuItem
                                onClick={() => handleModalOpen(item._id)}>
                                Edit
                              </MenuItem>
                            ) : null}
                          </Menu>
                        </Dropdown>
                      </td>
                    </tr>
                    {activeId === item._id ? (
                      <StandardModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}>
                        {modal}
                      </StandardModal>
                    ) : null}
                  </EntityCompose>
                ))}
              </tbody>
            </Table>
          </TabPanel>
        ) : null}
        {card ? (
          <TabPanel value={1}>
            <Grid container spacing={2} my={2}>
              {index?.map((item, index) => (
                <Grid xs={12} sm={4} key={index}>
                  <EntityCompose
                    _id={item._id}
                    initialValues={item}
                    provider={provider}
                    updateIndex={updateIndex}>
                    {card}
                  </EntityCompose>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        ) : null}
        <TabPanel value={2}>
          {index?.map((item, index) => (
            <Stack direction='row' key={index} alignItems='center' spacing={4}>
              <Typography>{item?._id}</Typography>
              <Typography
                level='body-xs'
                sx={{
                  flexGrow: 1,
                }}>
                <LazyReactJson collapsed src={item} theme='harmonic' />
              </Typography>
            </Stack>
          ))}
        </TabPanel>
      </Tabs>
    </Box>
  )
}
