import { Batch, TaskStatus } from './fileExporter'

export const mockFileExporter: Batch[] = [
  {
    id: '5c91170432966b0016c4337c',
    scopelock: 'mediashare-exporter_EZICOM23-5116',
    correlationId: '5116',
    tasks: [
      {
        id: '5c91170432966b0016c43383',
        status: TaskStatus.Failed,
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/1_det32.jpg'
      },
      {
        id: '5c91170432966b0016c43382',
        status: TaskStatus.Failed,
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/1_det33.jpg'
      },
      {
        id: '5c91170432966b0016c43381',
        status: TaskStatus.Failed,
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/1_det34.jpg'
      },
      {
        id: '5c91170432966b0016c43380',
        status: TaskStatus.Failed,
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/12955954_det8.jpg'
      },
      {
        id: '5c91170432966b0016c4337f',
        status: TaskStatus.Ended,
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/a3.jpg'
      },
      {
        id: '5c91170432966b0016c4337e',
        status: TaskStatus.Ended,
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/a2.jpg'
      },
      {
        id: '5c91170432966b0016c4337d',
        status: TaskStatus.Ended,
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/a1.jpg'
      }
    ]
  },
  {
    id: '5c9cc94c81cf1100162ab4f9',
    scopelock: 'mediashare-exporter_EZICOM23-5124',
    correlationId: '5124',
    tasks: []
  },
  {
    id: '5cc6bf09d01b8900220f212f',
    scopelock: 'mediashare-exporter_LADC5-5153',
    correlationId: '5153',
    tasks: [
      {
        id: '5cc6bf09d01b8900220f2139',
        status: TaskStatus.Ended,
        sourceURI: '/home/agwali/TempFolder/LADC5_5153/c1.jpg'
      },
      {
        id: '5cc6bf09d01b8900220f2138',
        status: TaskStatus.Ended,
        sourceURI: '/home/agwali/TempFolder/LADC5_5153/c2.jpg'
      },
      {
        id: '5cc6bf09d01b8900220f2137',
        status: TaskStatus.Ended,
        sourceURI: '/home/agwali/TempFolder/LADC5_5153/c3.jpg'
      }
    ]
  }
]
