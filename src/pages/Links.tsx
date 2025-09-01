
import { useState, useEffect } from 'react'
import axios from 'axios'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Plus, Link as LinkIcon, Trash2, Pencil, GripVertical } from 'lucide-react'
import SortableItem from '../components/SortableItem'
import LinkForm from '../components/LinkForm'
import LinkPreview from '../components/LinkPreview'

interface Link {
  id: string
  title: string
  url: string
  icon: string
  clicks: number
  order: number
}

const Links = () => {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data } = await axios.get('/api/links')
        setLinks(data.sort((a: Link, b: Link) => a.order - b.order))
      } catch (error) {
        console.error('Failed to fetch links:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLinks()
  }, [])

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })

      try {
        await axios.patch('/api/links/reorder', {
          linkId: active.id,
          newOrder: over.id,
        })
      } catch (error) {
        console.error('Failed to reorder links:', error)
      }
    }
  }

  const handleAddLink = async (link: Omit<Link, 'id' | 'clicks' | 'order'>) => {
    try {
      const { data } = await axios.post('/api/links', link)
      setLinks([...links, data])
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to add link:', error)
    }
  }

  const handleUpdateLink = async (updatedLink: Link) => {
    try {
      const { data } = await axios.patch(`/api/links/${updatedLink.id}`, updatedLink)
      setLinks(links.map((link) => (link.id === data.id ? data : link)))
      setEditingLink(null)
    } catch (error) {
      console.error('Failed to update link:', error)
    }
  }

  const handleDeleteLink = async (id: string) => {
    try {
      await axios.delete(`/api/links/${id}`)
      setLinks(links.filter((link) => link.id !== id))
    } catch (error) {
      console.error('Failed to delete link:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Links</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your bio links and track their performance
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLink(null)
            setIsFormOpen(true)
          }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Link
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-dark-800">
            <div className="px-4 py-5 sm:p-6">
              {links.length === 0 ? (
                <div className="text-center">
                  <LinkIcon className="w-12 h-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No links yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by adding your first link.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Link
                    </button>
                  </div>
                </div>
              ) : (
                <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={links}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="divide-y divide-gray-200 dark:divide-dark-700">
                      {links.map((link) => (
                        <SortableItem key={link.id} id={link.id}>
                          <div className="flex items-center justify-between py-4">
                            <div className="flex items-center">
                              <GripVertical className="w-5 h-5 mr-3 text-gray-400 cursor-move" />
                              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary-50 dark:bg-dark-700">
                                <LinkIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {link.title}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {link.url}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-dark-700 dark:text-primary-400">
                                {link.clicks} clicks
                              </span>
                              <button
                                onClick={() => setEditingLink(link)}
                                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 dark:text-gray-400"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteLink(link.id)}
                                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 dark:text-gray-400"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </SortableItem>
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <LinkPreview links={links} />
        </div>
      </div>

      {(isFormOpen || editingLink) && (
        <LinkForm
          link={editingLink}
          onClose={() => {
            setIsFormOpen(false)
            setEditingLink(null)
          }}
          onSubmit={editingLink ? handleUpdateLink : handleAddLink}
        />
      )}
    </div>
  )
}

export default Links
  