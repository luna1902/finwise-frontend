import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Table } from "flowbite-react";
import BlogsDataModal from './BlogsDataModal';
import DeletePage from './DeletePage';

const BlogsData = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState(null);
  let i = 1;
  let count = 0;
  const [btnClick, setBtnClick] = useState(count);

  const handleOpenModal = (blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseModal = () => {
    setSelectedBlog(null);
  };

  const handleOpenDeleteModal = (blogId) => {
    setDeleteBlogId(blogId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteBlogId(null);
    setOpenDeleteModal(false);
  };

  const handleDeleteOption = async () => {
    if (deleteBlogId) {
      try {
        const response = await axios.post('https://finwisebackend.onrender.com/api/admindashboard/blogs-delete', { id: deleteBlogId });
        if (response.status === 201) {
          console.log('Content Deleted');
          // Remove deleted blog from state
          setBlogsData(blogsData.filter(blog => blog._id !== deleteBlogId));
          handleCloseDeleteModal();
        } else {
          console.error('Error:', response.data);
        }
      } catch (error) {
        console.log('Error', error);
      }
    }
  };

  const handleApproveOption = async () => {
    if (selectedBlog) {
      const approveid = selectedBlog._id; // Get the ID of the selected blog
      const newApprovalStatus = !selectedBlog.isApproved; // Toggle the approval status
      try {
        const response = await axios.post('https://finwisebackend.onrender.com/api/admindashboard/blogs-isApproved', { id: approveid });
        if (response.status === 200) {
          console.log('Status Changed');
          // Update the state based on the new approval status
          setBlogsData((prevBlogs) =>
            prevBlogs.map((blog) =>
              blog._id === approveid ? { ...blog, isApproved: newApprovalStatus } : blog
            )
          );
          handleCloseModal();
        } else {
          console.error('Error:', response.data);
        }
      } catch (error) {
        console.log('Error', error);
      }
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://finwisebackend.onrender.com/api/admindashboard/blogs');
        setBlogsData(response.data);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };
    fetchData();
  }, [btnClick]);

  return (
    <div>
      <p onClick={() => {setBtnClick(count++)}} className='text-right cursor-pointer'>Refresh</p>
      {blogsData.length > 0 ? (
        <>
              <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>S.No</Table.HeadCell>
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Edit</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {blogsData.map((item) => (
                    <Table.Row key={item._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                       {i++}
                                    </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </Table.Cell>
                      <Table.Cell>{item.writeDate}</Table.Cell>
                      <Table.Cell><p className={`${item.isApproved ? 'text-green-800' : 'text-red-800'}`}>{item.isApproved ? 'Approved' : 'Not Approved'}</p></Table.Cell>
                      <Table.Cell>
                        <button className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={() => handleOpenModal(item)}>
                          View
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        <button className="font-medium text-red-600 hover:text-red-800 dark:text-red-500" onClick={() => handleOpenDeleteModal(item._id)}>
                          Delete
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  {selectedBlog && (
                    <BlogsDataModal
                      setOpenModal={handleCloseModal}
                      setApproveoption={handleApproveOption}
                      item_id={selectedBlog._id}
                      item_title={selectedBlog.title}
                      item_content={selectedBlog.content}
                      item_date={selectedBlog.writeDate}
                      item_approved={selectedBlog.isApproved}
                    />
                  )}
                </Table.Body>
              </Table>
            </div>
      
            {openDeleteModal && (
              <DeletePage
                openModal={openDeleteModal}
                setOpenModal={handleCloseDeleteModal}
                handleDeleteOption={handleDeleteOption}
              />
            )}
            </>
      ) : (
        <div>No Data is Available</div>
      )}
    </div>
  );
};

export default BlogsData;



        // <div key={item._id} className="blog-item">
        //   <h2>{item.title}</h2>
        //   <p dangerouslySetInnerHTML={{ __html: item.content }} />
        //   <p>Write Date: {new Date(item.writeDate).toLocaleDateString()}</p>
        //   <p>Status: {item.isApproved ? 'Approved' : 'Not Approved'}</p>
        // </div>




            // <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-0'>
    //   {blogsData.map((item) => (
    //     <Card key={item._id} className="blog-item max-w-sm">
    //       <div className='flex flex-row justify-between'>
    //         <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    //           {item.title}
    //         </h5>
    //         <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
    //           {item.writeDate}
    //         </h5>
    //       </div>
    //       <p className="font-normal text-gray-700 dark:text-gray-400">Person Name Here</p>
    //       <Button onClick={() => handleOpenModal(item)}>
    //         Read more
    //         <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    //           <path
    //             fillRule="evenodd"
    //             d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
    //             clipRule="evenodd"
    //           />
    //         </svg>
    //       </Button>
    //       <p className={`${item.isApproved ? 'text-green-800 font-black' : 'text-red-800 font-black'}`}>
    //         Status: {item.isApproved ? 'Approved' : 'Not Approved'}
    //       </p>
    //     </Card>
    //   ))}
      // {selectedBlog && (
      //   <BlogsDataModal
      //     setOpenModal={handleCloseModal}
      //     item_id={selectedBlog._id}
      //     item_title={selectedBlog.title}
      //     item_content={selectedBlog.content}
      //     item_date={selectedBlog.writeDate}
      //     item_approved={selectedBlog.isApproved}
      //   />
      // )}
    // </div>