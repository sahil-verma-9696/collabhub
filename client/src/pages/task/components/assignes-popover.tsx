import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldGroup } from "@/components/ui/field";
import { UserListItem } from "@/components/user-list-item";
import { useAppContext } from "@/contexts/app.context";
import React, { Fragment } from "react";
import { Await } from "react-router";

export const AssigneesPopover = () => {
  const appCtx = useAppContext();

  return (
    <>
      <FieldGroup className="mx-auto p-1 gap-0">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Await resolve={appCtx.loaderData.members}>
            {(members) => {
              return (
                <>
                  {members.map((member) => (
                    <Fragment key={member._id}>
                      <Field
                        orientation="horizontal"
                        className="flex items-center!"
                      >
                        <Checkbox
                          id="terms-checkbox-basic"
                          name="terms-checkbox-basic"
                        />
                        <FieldContent>
                          <UserListItem user={member.user} />
                        </FieldContent>
                      </Field>
                    </Fragment>
                  ))}
                </>
              );
            }}
          </Await>
        </React.Suspense>
      </FieldGroup>
    </>
  );
};
