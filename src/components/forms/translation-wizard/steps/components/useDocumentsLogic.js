'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png'
];

export default function useDocumentsLogic({ register, control, setValue, clearErrors, setError, getValues }) {
  const [uploadWarning, setUploadWarning] = useState('');

  const watchedFiles = useWatch({ control, name: 'documents.files' });
  const files = useMemo(() => (Array.isArray(watchedFiles) ? watchedFiles : []), [watchedFiles]);
  const link = useWatch({ control, name: 'documents.link' }) || '';
  const deferUpload = useWatch({ control, name: 'documents.deferUpload' }) || false;

  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    register('documents.files', {
      validate: (value) => {
        if (deferUpload) return true;
        const hasFiles = value && value.length > 0;
        const hasLink = Boolean(link);
        return hasFiles || hasLink || 'Upload at least one file, share a link, or choose "Send later"';
      }
    });
  }, [register, link, deferUpload]);

  useEffect(() => {
    if (link) {
      clearErrors('documents.files');
      setUploadWarning('');
    }
  }, [link, clearErrors]);

  useEffect(() => {
    if (deferUpload) {
      clearErrors('documents.files');
      setUploadWarning('');
    }
  }, [deferUpload, clearErrors]);

  const handleFilesChange = useCallback(
    (incomingFiles) => {
      if (!incomingFiles.length) return;

      let rejected = 0;

      const filtered = incomingFiles.filter((file) => {
        const withinSize = file.size <= 20 * 1024 * 1024;
        const acceptedType = ACCEPTED_TYPES.includes(file.type);
        const acceptedName = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|jpeg|jpg|png)$/i.test(file.name);
        const ok = withinSize && (acceptedType || acceptedName);
        if (!ok) rejected += 1;
        return ok;
      });

      const nextFiles = [...(filesRef.current || []), ...filtered].slice(0, 5);
      setValue('documents.files', nextFiles, { shouldDirty: true, shouldValidate: true });

      if (nextFiles.length > 0) {
        clearErrors('documents.files');
        setUploadWarning(rejected > 0 ? 'Some files were skipped because they exceeded 20MB or used unsupported formats.' : '');
        const currentDocType = getValues?.('documents.documentType');
        if (!currentDocType) {
          const firstName = nextFiles[0]?.name?.split('.')?.[0] || '';
          if (firstName) {
            setValue('documents.documentType', firstName, { shouldDirty: false });
          }
        }
      }

      if (rejected > 0 && filtered.length === 0 && nextFiles.length === 0 && !link) {
        setError('documents.files', {
          type: 'manual',
          message:
            rejected === incomingFiles.length
              ? 'Files must be PDF, Office, or image formats under 20MB.'
              : 'Some files were skipped because they exceeded 20MB or used unsupported formats.'
        });
        setUploadWarning('');
      }
    },
    [setValue, clearErrors, setError, link, getValues]
  );

  const handleDeferToggle = useCallback(
    (next) => {
      setValue('documents.deferUpload', next, { shouldDirty: true, shouldValidate: true });
      if (next) {
        setValue('documents.files', [], { shouldDirty: true, shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemove = useCallback(
    (index) => {
      const next = (filesRef.current || []).filter((_, i) => i !== index);
      setValue('documents.files', next, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  return {
    files,
    link,
    deferUpload,
    uploadWarning,
    handleFilesChange,
    handleRemove,
    handleDeferToggle
  };
}
