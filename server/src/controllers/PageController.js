import * as pageMetaRepo from "../repos/PageMetaRepo.js";
import * as pageRepo from "../repos/PageRepo.js";
import { withTransaction } from "../utils/withTransaction.js";

export const create = async (req, res) => {
  let page, meta;

  const currentUserId = req.user.userId;
  const projectId = req.params.projectId;
  const metaPayload = req.body.meta;
  const pagePayload = req.body.page;

  await withTransaction(async (session) => {
    if (!projectId) throw new Error("projectId is required");
    if (!metaPayload) throw new Error("req.body.meta is required");
    if (!pagePayload) throw new Error("req.body.page is required");

    page = await pageRepo.create({ ...pagePayload }, { session });

    meta = await pageMetaRepo.create(
      {
        ...metaPayload,
        creator: currentUserId,
        project: projectId,
        page: page._id,
      },
      { session },
    );
  });

  return res.status(201).json({ page, meta });
};

export const getPagesMetaByProjectId = async (req, res) => {
  const pagesMeta = await pageMetaRepo.getByProjectId(req.params.projectId);
  return res.json(pagesMeta);
};

export const getPageById = async (req, res) => {
  const projectId = req.params.projectId;
  const pageId = req.params.pageId;
  const page = await pageRepo.getById(pageId);
  return res.json(page);
};

export const updateByPageId = async (req, res) => {
  const projectId = req.params.projectId;
  const pageId = req.params.pageId;

  const metaPayload = req.body.meta;
  const pagePayload = req.body.page;

  const pageMeta = await pageMetaRepo.updateByPageId(pageId, metaPayload);
  const page = await pageRepo.updateById(pageId, pagePayload);

  return res.json({ page, pageMeta });
};

export const updateById = async (req, res) => {
  const page = await pageRepo.updateById(req.params.pageId, req.body);
  return res.json(page);
};

export const deletePage = async (req, res) => {
  await withTransaction(async (session) => {
    const page = await pageRepo.getById(req.params.pageId, { session });

    if (!page) throw new Error("Page not found");

    await pageRepo.softDeleteById(page._id, req.user.userId, {
      session,
    });

    await pageMetaRepo.softDeleteById(page.meta, req.user.userId, { session });
  });

  return res.json({ message: "Page deleted successfully" });
};
