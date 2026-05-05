import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";
import React from "react";
import { Field, FieldContent, FieldGroup } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

export type Value<D> = {
  _id: string;
  checked: boolean;
  data: D;
};

export type TaskPropertyProps<D> = {
  name: string;
  valueUi?: React.FunctionComponent<{ data: D }>;
  initValue?: Value<D>[];
  onChange?: (value: Value<D>) => void;
} & React.PropsWithChildren;

function DefaultValueUi<D>({ data }: { data: D }) {
  return <>{JSON.stringify(data)}</>;
}

export function TaskProperty<D>({
  name,
  children,
  valueUi = DefaultValueUi,
  initValue,
  onChange,
}: TaskPropertyProps<D>) {
  const ValueUi: React.FunctionComponent<{ data: D }> | undefined = valueUi;

  const [values] = React.useState<Value<D>[]>(initValue || []);

  function handleCheckedChange(v: Value<D>) {
    onChange?.(v);
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="flex justify-between w-full bg-transparent border border-transparent text-gray-900 hover:bg-gray-300 hover:border-gray-900 hover:border">
            <span>{name}</span>
            <Settings />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="">
          {values.map((v) => {
            return (
              <React.Fragment key={v._id}>
                <FieldGroup className="mx-auto p-1 gap-0">
                  <Field
                    orientation="horizontal"
                    className="flex items-center!"
                  >
                    <Checkbox
                      id="terms-checkbox-basic"
                      name="terms-checkbox-basic"
                      defaultChecked={v.checked}
                      onCheckedChange={(checkedState) =>
                        handleCheckedChange({
                          ...v,
                          checked: !!checkedState,
                        })
                      }
                    />
                    <FieldContent>
                      {ValueUi && <ValueUi data={v.data} />}
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </React.Fragment>
            );
          })}
        </PopoverContent>
      </Popover>
      <Card className="shadow-none border-none p-3">{children}</Card>
    </div>
  );
}
