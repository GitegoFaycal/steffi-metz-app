import { useEffect, useState } from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import {
  getCommunityApplications,
  updateCommunityApplicationStatus,
  deleteCommunityApplication,
} from '../api/communityApplicationsApi';

export default function CommunityApplicationsManager() {
  const [applications, setApplications] = useState([]);
  const [notice, setNotice] = useState('');

  const loadApplications = async () => {
    try {
      const data = await getCommunityApplications();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Failed to load community applications:', error);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateCommunityApplicationStatus(id, {
        status,
        admin_notes: '',
      });

      setNotice(`Application marked as ${status}.`);
      await loadApplications();
    } catch (error) {
      setNotice(
        error.response?.data?.message || 'Failed to update application.'
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this application?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteCommunityApplication(id);
      await loadApplications();
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[.2em] text-bordeaux">
          Community
        </p>

        <h1 className="font-serif text-4xl text-olive-dark mt-2">
          Community Applications
        </h1>

        <p className="text-stone-600 mt-3 max-w-2xl leading-7">
          Review people who apply to cook with the community. Approve or reject
          applications based on availability, product idea, and session needs.
        </p>
      </div>

      {notice && (
        <p className="bg-white border border-olive/10 rounded-lg p-4 mb-5 text-sm text-olive-dark">
          {notice}
        </p>
      )}

      <div className="bg-white border border-olive/10 rounded-xl overflow-hidden">
        {applications.length === 0 ? (
          <p className="p-6 text-stone-500 text-sm">
            No community applications found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-linen text-left text-stone-500 uppercase tracking-widest text-xs">
                <tr>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Product Cost</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-t border-olive/10 align-top"
                  >
                    <td className="p-4">
                      <p className="font-medium text-olive-dark">
                        {application.full_name}
                      </p>

                      <p className="text-stone-500 mt-1">
                        {application.phone}
                      </p>

                      {application.email && (
                        <p className="text-stone-400 mt-1">
                          {application.email}
                        </p>
                      )}

                      {application.message && (
                        <p className="text-stone-500 mt-3 max-w-xs leading-6">
                          {application.message}
                        </p>
                      )}
                    </td>

                    <td className="p-4 text-stone-600">
                      <p>
                        {application.product_idea || 'Not specified'}
                      </p>

                      <p className="text-xs text-stone-400 mt-2">
                        Brings own product:{' '}
                        {application.brings_own_product}
                      </p>
                    </td>

                    <td className="p-4 text-stone-600">
                      {application.willing_to_pay_product_cost}
                    </td>

                    <td className="p-4 text-stone-600">
                      {application.preferred_date || 'Not specified'}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-linen text-xs uppercase tracking-widest text-olive-dark">
                        {application.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(application.id, 'approved')
                          }
                          className="inline-flex items-center gap-2 text-green-700 underline"
                        >
                          <CheckCircle size={15} />
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(application.id, 'rejected')
                          }
                          className="inline-flex items-center gap-2 text-bordeaux underline"
                        >
                          <XCircle size={15} />
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(application.id)}
                          className="inline-flex items-center gap-2 text-stone-500 underline"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}