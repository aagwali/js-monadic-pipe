import { FuturError } from 'ts-functors'

export type AppError = FuturError<ErrorLocation>

export enum ErrorLocation {
  TryBuildConfig = 'tryValidateEnvKeys failed for :',
  UpsertBullMsg = 'upsertBullMsg',
  BrowseMsSupplierDirectory = 'browseMsSupplierDirectory',
  GetBatches = 'GetBatches',
  UnlinkFiles = 'unlinkFiles',
  RemoveDirectory = 'removeDirectory',
  DeletionTask = 'deletionTask',
  UNKNOWN = '⚠ unregistered error ⚠'
}

export const offline: any = [
  {
    id: '5c91170432966b0016c4337c',
    scopelock: 'mediashare-exporter_EZICOM23-5116',
    correlationId: '5116',
    tasks: [
      {
        id: '5c91170432966b0016c43383',
        status: 'failed',
        destinationURI:
          '/mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5116/1_det32.jpg',
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/1_det32.jpg'
      },
      {
        id: '5c91170432966b0016c43382',
        status: 'failed',
        destinationURI:
          '/mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5116/1_det33.jpg',
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/1_det33.jpg'
      },
      {
        id: '5c91170432966b0016c43381',
        status: 'failed',
        destinationURI:
          '/mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5116/1_det34.jpg',
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/1_det34.jpg'
      },
      {
        id: '5c91170432966b0016c43380',
        status: 'failed',
        destinationURI:
          '/mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5116/12955954_det8.jpg',
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/12955954_det8.jpg'
      },
      {
        id: '5c91170432966b0016c4337f',
        status: 'ended',
        destinationURI:
          '/mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5116/12955954_det9.jpg',
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/a3.jpg'
      },
      {
        id: '5c91170432966b0016c4337e',
        status: 'ended',
        destinationURI:
          '/mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5116/12955954_det7.jpg',
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/a2.jpg'
      },
      {
        id: '5c91170432966b0016c4337d',
        status: 'ended',
        destinationURI:
          '/mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5116/12955954_det6.jpg',
        sourceURI: '/home/agwali/TempFolder/EZICOM23_5116/a1.jpg'
      }
    ],
    notifyMessage:
      "\nBonjour **Wing Tching LIM**,\nL'export des 7 media de EZICOM23 est terminé :\n\n7 media ont été tagués pour retouche INTERNE\n0 media ont été tagués pour retouche externe (OTSC)\n\nDossier d'export : /mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5116\nBonne journée.\n\n<hr/>\n\nHello **Wing Tching LIM**, \nThe export of 7  media for EZICOM23 is completed :\n\n7 media have been tagged for INTERNAL retouch\n0 media have been tagged for external retouch (OTSC)\n\nExport directory path : /mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5116\nHave a nice day.\n",
    user: {
      isAuthenticated: true,
      email: 'wtlim@vente-privee.com',
      fullName: 'Wing Tching LIM',
      windowsAccountName: 'wtlim'
    },
    createdAt: '2019-03-19T16:21:24.952Z',
    updatedAt: '2019-03-19T16:21:24.952Z'
  },
  {
    id: '5c9cc94c81cf1100162ab4f9',
    scopelock: 'mediashare-exporter_EZICOM23-5124',
    correlationId: '5124',
    tasks: [],
    notifyMessage:
      "\nBonjour **Wing Tching LIM**,\nL'export des 3 media de EZICOM23 est terminé :\n\n3 media ont été tagués pour retouche INTERNE\n0 media ont été tagués pour retouche externe (OTSC)\n\nDossier d'export : /mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5124\nBonne journée.\n\n<hr/>\n\nHello **Wing Tching LIM**, \nThe export of 3  media for EZICOM23 is completed :\n\n3 media have been tagged for INTERNAL retouch\n0 media have been tagged for external retouch (OTSC)\n\nExport directory path : /mnt/ventes/VENTES 2017/4-Oct-Dec/EZICOM23/Photos/1 sources/Fournisseur/GOPROD_5124\nHave a nice day.\n",
    user: {
      isAuthenticated: true,
      email: 'wtlim@vente-privee.com',
      fullName: 'Wing Tching LIM',
      windowsAccountName: 'wtlim'
    },
    createdAt: '2019-03-28T13:17:00.610Z',
    updatedAt: '2019-03-28T13:17:00.610Z'
  },
  {
    id: '5cc6bf09d01b8900220f212f',
    scopelock: 'mediashare-exporter_LADC5-5153',
    correlationId: '5153',
    tasks: [
      {
        id: '5cc6bf09d01b8900220f2139',
        status: 'ended',
        destinationURI:
          '/mnt/ventes/VENTES 2019/1-Jan-Mar/LADC5/Photos/1 sources/Fournisseur/GOPROD_5153/18517572_det0.jpg',
        sourceURI: '/home/agwali/TempFolder/LADC5_5153/c1.jpg'
      },
      {
        id: '5cc6bf09d01b8900220f2138',
        status: 'ended',
        destinationURI:
          '/mnt/ventes/VENTES 2019/1-Jan-Mar/LADC5/Photos/1 sources/Fournisseur/GOPROD_5153/18517572_det1.jpg',
        sourceURI: '/home/agwali/TempFolder/LADC5_5153/c2.jpg'
      },
      {
        id: '5cc6bf09d01b8900220f2137',
        status: 'ended',
        destinationURI:
          '/mnt/ventes/VENTES 2019/1-Jan-Mar/LADC5/Photos/1 sources/Fournisseur/GOPROD_5153/18517667_det0.jpg',
        sourceURI: '/home/agwali/TempFolder/LADC5_5153/c3.jpg'
      }
    ],
    notifyMessage:
      "\nBonjour **Adrien AGWALI**,\nL'export des 10 media de LADC5 est terminé :\n\n10 media ont été tagués pour retouche INTERNE\n0 media ont été tagués pour retouche externe (OTSC)\n\nDossier d'export : /mnt/ventes/VENTES 2019/1-Jan-Mar/LADC5/Photos/1 sources/Fournisseur/GOPROD_5153\nBonne journée.\n\n<hr/>\n\nHello **Adrien AGWALI**, \nThe export of 10  media for LADC5 is completed :\n\n10 media have been tagged for INTERNAL retouch\n0 media have been tagged for external retouch (OTSC)\n\nExport directory path : /mnt/ventes/VENTES 2019/1-Jan-Mar/LADC5/Photos/1 sources/Fournisseur/GOPROD_5153\nHave a nice day.\n",
    user: {
      isAuthenticated: true,
      email: 'aagwali@vente-privee.com',
      fullName: 'Adrien AGWALI',
      windowsAccountName: 'aagwali'
    },
    createdAt: '2019-04-29T09:08:25.928Z',
    updatedAt: '2019-04-29T09:08:26.667Z'
  }
]
