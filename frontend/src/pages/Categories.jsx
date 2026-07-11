import { useCallback, useEffect, useState } from 'react'
import categoryApi from 'e:/financetracker/frontend/src/api/categoryApi.js'
import CategoryForm from '../component/CategoryForm.jsx'
import CategoryList from '../component/CategoryList.jsx'
import Modal from '../component/Modal.jsx'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await categoryApi.getAll()
      setCategories(data)
    } catch (err) {
      setError('Could not load categories. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const openAddModal = () => {
    setEditingCategory(null)
    setModalOpen(true)
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    setError('')
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, payload)
      } else {
        await categoryApi.create(payload)
      }
      closeModal()
      await loadCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this category.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete the "${category.name}" category?`)) return
    setError('')
    try {
      await categoryApi.remove(category.id)
      await loadCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this category.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Organize income and expenses into categories used across transactions and budgets.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ Add category</button>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="empty-state"><p>Loading categories…</p></div>
        ) : (
          <CategoryList categories={categories} onEdit={openEditModal} onDelete={handleDelete} />
        )}
      </div>

      {modalOpen && (
        <Modal title={editingCategory ? 'Edit category' : 'Add category'} onClose={closeModal}>
          <CategoryForm
            initialData={editingCategory}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}