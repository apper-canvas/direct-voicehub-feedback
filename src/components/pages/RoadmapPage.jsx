import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, addMonths } from 'date-fns';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import SearchBar from '@/components/molecules/SearchBar';
import RoadmapCard from '@/components/molecules/RoadmapCard';
import RoadmapItemModal from '@/components/organisms/RoadmapItemModal';
import ApperIcon from '@/components/ApperIcon';
import { roadmapService } from '@/services/api/roadmapService';

const RoadmapPage = () => {
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Timeline configuration
  const timelineStart = new Date('2024-10-01');
  const timelineEnd = new Date('2025-06-30');
  const months = eachMonthOfInterval({ start: timelineStart, end: timelineEnd });
  const currentDate = new Date();

  useEffect(() => {
    loadRoadmapItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [roadmapItems, filters]);

  const loadRoadmapItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await roadmapService.getAll();
      setRoadmapItems(items);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load roadmap items');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...roadmapItems];

    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(item => item.priority === filters.priority);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.assignee.toLowerCase().includes(searchLower)
      );
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleOpenCreateModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSubmitItem = async (itemData) => {
    try {
      if (selectedItem) {
        await roadmapService.update(selectedItem.Id, itemData);
        toast.success('Roadmap item updated successfully');
      } else {
        await roadmapService.create(itemData);
        toast.success('Roadmap item created successfully');
      }
      await loadRoadmapItems();
      handleCloseModal();
    } catch (error) {
      throw error;
    }
  };

  const groupItemsByStatus = (items) => {
    const grouped = {
      'Planned': [],
      'In Progress': [],
      'Completed': [],
      'On Hold': [],
      'Research': []
    };

    items.forEach(item => {
      if (grouped[item.status]) {
        grouped[item.status].push(item);
      }
    });

    return grouped;
  };

  if (loading) {
    return <Loading type="cards" count={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadRoadmapItems} />;
  }

  const groupedItems = groupItemsByStatus(filteredItems);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="Map" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Roadmap</h1>
              <p className="text-gray-600 text-sm">Timeline view of product development</p>
            </div>
          </div>

          <Button onClick={handleOpenCreateModal} className="btn-press">
            <ApperIcon name="Plus" size={18} />
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            {roadmapService.STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Select>

          <Select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="all">All Priorities</option>
            {roadmapService.PRIORITY_OPTIONS.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.emoji} {priority.label}
              </option>
            ))}
          </Select>

          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {roadmapService.CATEGORY_OPTIONS.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>

          <SearchBar
            placeholder="Search roadmap..."
            onSearch={handleSearch}
            initialValue={filters.search}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium text-gray-700">Status:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-gray-600">Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-600">On Hold</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-gray-600">Research</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {filteredItems.length === 0 ? (
        <Empty
          title="No roadmap items found"
          message="Start building your product roadmap by adding your first item."
          actionLabel="Add First Item"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card p-6">
          {/* Timeline Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Timeline View</h2>
              <div className="text-sm text-gray-600">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} shown
              </div>
            </div>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Month Headers */}
            <div className="flex gap-4 mb-6 pb-4 border-b-2 border-gray-300 overflow-x-auto">
              {months.map((month, index) => (
                <div key={index} className="flex-shrink-0 min-w-[280px]">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {format(month, 'MMMM yyyy')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {format(month, 'QQQ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Date Indicator */}
            {currentDate >= timelineStart && currentDate <= timelineEnd && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{
                  left: `${((currentDate - timelineStart) / (timelineEnd - timelineStart)) * 100}%`
                }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-500 text-white text-xs rounded whitespace-nowrap">
                  Today
                </div>
              </div>
            )}

            {/* Swimlanes by Status */}
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([status, items]) => (
                items.length > 0 && (
                  <div key={status} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {status} ({items.length})
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {items.map((item) => (
                        <RoadmapCard
                          key={item.Id}
                          item={item}
                          onClick={() => handleOpenEditModal(item)}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <RoadmapItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitItem}
        item={selectedItem}
      />
    </div>
  );
};

export default RoadmapPage;