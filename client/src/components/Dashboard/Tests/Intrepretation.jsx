import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
function Intrepretation({ name, control, label, defaultValue = "" }) {
    return (
        <div className="w-full py-4">
            {label && <label className="inline-block mb-1 pl-1">{label}</label>}
            <Controller
                name={name || "textTest"}
                control={control}
                render={({ field: { onChange } }) => (
                    <Editor
                        apiKey="6o988l9g1h822ufwzj7uxorod1xemy321qbp3t7udn1oxc8n"
                        initialValue={defaultValue}
                        init={{
                            height: 300,
                            menubar: true,
                            plugins: [
                                "image",
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "code",
                                "help",
                                "wordcount",
                                "anchor",
                            ],
                            toolbar:
                                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            tinycomments_mode: "embedded",
                            tinycomments_author: "Author name",
                            mergetags_list: [
                                { value: "First.Name", title: "First Name" },
                                { value: "Email", title: "Email" },
                            ],
                            ai_request: (request, respondWith) =>
                                respondWith.string(() =>
                                    Promise.reject("See docs to implement AI Assistant")
                                ),
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    );
}

export default Intrepretation;